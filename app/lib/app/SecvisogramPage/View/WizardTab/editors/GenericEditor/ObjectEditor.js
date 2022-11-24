import {
  faCircle,
  faInfoCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SideBarContext from '../../../shared/context/SideBarContext.js'
import WizardContext from '../../../shared/context/WizardContext.js'
import DocumentEditorContext from '../../../shared/DocumentEditorContext.js'
import { GenericEditor } from '../../editors.js'
import { getErrorTextColor } from '../GenericEditor.js'

/**
 * @param {object} props
 * @param {import('../../shared/types').Property | null} props.parentProperty
 * @param {import('../../shared/types').Property} props.property
 * @param {string[]} props.instancePath
 */
export default function ObjectEditor({
  parentProperty,
  property,
  instancePath,
}) {
  const { selectedPath, setSelectedPath } = React.useContext(WizardContext)
  const { doc, updateDoc } = React.useContext(DocumentEditorContext)
  const { errors } = React.useContext(DocumentEditorContext)
  const fieldProperties = property.metaInfo.propertyList?.filter(
    (p) => !['OBJECT', 'ARRAY'].includes(p.type)
  )
  const complexProperties = property.metaInfo.propertyList?.filter((p) =>
    ['OBJECT', 'ARRAY'].includes(p.type)
  )
  const menuNodes = getObjectMenuNodes(property)
  const selectedSubPath = getObjectMenuPaths(property)
    .slice()
    .map((p) => p.instancePath)
    .sort((a, z) => z.length - a.length)
    .find((menuPath) =>
      menuPath.every(
        (seg, i) => seg === selectedPath.slice(instancePath.length)[i]
      )
    )
  const sideBarData = React.useContext(SideBarContext)

  const fieldsErrors = errors.filter(
    (e) =>
      e.instancePath.startsWith('/' + instancePath.join('/')) &&
      e.instancePath.split('/').length === instancePath.length + 2
  )

  const value = instancePath.reduce((value, pathSegment) => {
    return (value ?? {})[pathSegment]
  }, /** @type {Record<string, any> | null} */ (doc))
  const sanitizedValue = value ?? {}

  const selectedMenuPath = selectedPath.slice(instancePath.length)

  /**
   * @param {string[]} path
   * @returns
   */
  const resolveSubProperty = (path) =>
    path.reduce((property, pathSegment) => {
      return (
        property?.metaInfo.propertyList?.find((p) => p.key === pathSegment) ??
        null
      )
    }, /** @type {typeof property | null} */ (property))

  const selectedProperty =
    selectedSubPath && resolveSubProperty(selectedSubPath)

  const renderComplexEditor = () => {
    if (!selectedSubPath) return null
    if (!selectedProperty) return null
    return (
      <GenericEditor
        key={instancePath.concat(selectedSubPath).join('.')}
        instancePath={instancePath.concat(selectedSubPath)}
        parentProperty={resolveSubProperty(selectedSubPath.slice(0, -1))}
        property={selectedProperty}
      />
    )
  }

  const renderFieldsEditor = () => {
    return (
      <div className="flex flex-col gap-4 p-4">
        {fieldProperties?.map((property) => (
          <GenericEditor
            key={property.key}
            property={property}
            parentProperty={resolveSubProperty(selectedSubPath ?? [])}
            instancePath={instancePath
              .concat(selectedSubPath ?? [])
              .concat([property.key])}
          />
        ))}
      </div>
    )
  }

  /**
   * @param {MenuNode[]} menuNodes
   * @param {number} [level]
   * @returns
   */
  const renderMenuNodes = (menuNodes, level = 0) => {
    return (
      <ul>
        {menuNodes.map((menuItem, menuItemIndex) => {
          const childErrors = errors.filter((e) =>
            e.instancePath.startsWith(
              '/' + [...instancePath, ...menuItem.instancePath].join('/')
            )
          )
          const isSelected =
            selectedSubPath &&
            menuItem.instancePath.every((p, i) => selectedSubPath[i] === p)
          const docuPathFromInstancePath = [
            ...instancePath,
            ...menuItem.instancePath,
          ].filter((p) => Number.isNaN(Number(p)))
          const isActiveInSidebar =
            docuPathFromInstancePath.length ===
              sideBarData.sideBarSelectedPath.length &&
            docuPathFromInstancePath.every(
              (p, i) => sideBarData.sideBarSelectedPath[i] === p
            )

          return (
            <React.Fragment key={menuItem.instancePath.join('.')}>
              {level === 0 && fieldProperties?.length ? (
                <li
                  className={
                    (!selectedMenuPath.length ? 'font-bold' : '') +
                    ' bg-gray-200 flex w-full'
                  }
                >
                  <div className="grid place-items-center px-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className={getErrorTextColor(fieldsErrors)}
                      size="xs"
                    />
                  </div>
                  <button
                    className="italic text-left w-full px-2 h-9 hover:underline"
                    onClick={() => {
                      setSelectedPath(instancePath)
                    }}
                  >
                    Fields
                  </button>
                </li>
              ) : null}
              <li
                className={`bg-gray-200 ${
                  instancePath.length === 0 &&
                  menuItem.instancePath.length === 1 &&
                  menuItemIndex > 0
                    ? 'mt-4'
                    : ''
                }`}
                style={{}}
              >
                <div
                  className={
                    `${isSelected ? 'font-bold' : ''}` + ' flex w-full'
                  }
                >
                  <div className="grid place-items-center px-2">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className={getErrorTextColor(childErrors)}
                      size="xs"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-2 w-full text-left hover:underline whitespace-nowrap"
                    data-testid={`menu_entry-/${instancePath
                      .concat(menuItem.instancePath)
                      .join('/')}`}
                    onClick={() => {
                      setSelectedPath([
                        ...instancePath,
                        ...menuItem.instancePath,
                      ])
                    }}
                  >
                    {menuItem.title}
                  </button>
                  {menuItem.property.type === 'ARRAY' ? (
                    <button
                      data-testid={`menu_entry-/${[
                        ...instancePath,
                        ...menuItem.instancePath,
                      ].join('/')}-add_item_button`}
                      onClick={() => {
                        const menuItemValue = menuItem.instancePath.reduce(
                          (value, pathSegment) => {
                            return (value ?? {})[pathSegment]
                          },
                          /** @type {Record<string, any> | null} */ (
                            sanitizedValue
                          )
                        )
                        const sanitizedMenuItemValue = Array.isArray(
                          menuItemValue
                        )
                          ? menuItemValue
                          : []
                        const childType =
                          menuItem.property.metaInfo.arrayType?.type
                        const newItem =
                          childType === 'OBJECT'
                            ? {}
                            : childType === 'ARRAY'
                            ? []
                            : childType === 'STRING'
                            ? ''
                            : null
                        if (newItem !== null) {
                          updateDoc(
                            [...instancePath, ...menuItem.instancePath],
                            sanitizedMenuItemValue.concat([newItem])
                          )
                          setSelectedPath([
                            ...instancePath,
                            ...menuItem.instancePath,
                            String(sanitizedMenuItemValue.length),
                          ])
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  ) : null}
                  <button
                    data-testid={
                      [...instancePath, ...menuItem.instancePath].join('-') +
                      '-infoButton'
                    }
                    type="button"
                    className={
                      'w-9 h-9 flex-none hover:text-slate-600 ' +
                      `${
                        isActiveInSidebar ? 'text-slate-600' : 'text-slate-400'
                      }`
                    }
                    onClick={() => {
                      sideBarData.setSideBarIsOpen(true)
                      sideBarData.setSideBarSelectedPath([
                        ...instancePath,
                        ...menuItem.instancePath,
                      ])
                    }}
                  >
                    <FontAwesomeIcon icon={faInfoCircle} size="xs" />
                  </button>
                </div>
                {renderMenuNodes(menuItem.children, level + 1)}
              </li>
            </React.Fragment>
          )
        })}
      </ul>
    )
  }

  return (
    <>
      {!complexProperties?.length ? (
        renderFieldsEditor()
      ) : (
        <>
          {parentProperty?.addMenuItemsForChildObjects ? null : (
            <div className="treeview flex bg-gray-50 border-r border-l border-solid border-gray-400 wizard-menu-shadow mr-2">
              {renderMenuNodes(menuNodes)}
            </div>
          )}
          {selectedSubPath ? renderComplexEditor() : renderFieldsEditor()}
        </>
      )}
    </>
  )
}

/**
 * @param {import('../../shared/types').Property} property
 * @param {string[]} [instancePath]
 */
export function getObjectMenuPaths(property, instancePath = []) {
  const menuProperties =
    property.metaInfo.propertyList?.filter(
      (p) => p.type === 'OBJECT' || p.type === 'ARRAY'
    ) ?? []
  /** @type {Array<{ instancePath: string[] }>} */
  const menuStructure =
    menuProperties.flatMap((childProperty) => {
      return [
        ...(childProperty.type === 'OBJECT' || childProperty.type === 'ARRAY'
          ? [
              {
                instancePath: [...instancePath, childProperty.key],
              },
            ]
          : []),
        ...(childProperty.type === 'OBJECT' &&
        property.addMenuItemsForChildObjects
          ? getObjectMenuPaths(childProperty, [
              ...instancePath,
              childProperty.key,
            ])
          : []),
      ]
    }) ?? []

  return menuStructure
}

/**
 * @typedef {object} MenuNode
 * @property {boolean} isArray
 * @property {string} key
 * @property {'STRING' | 'ARRAY' | 'OBJECT' | 'RECURSION'} type
 * @property {string[]} instancePath
 * @property {import('../../shared/types').Property} property
 * @property {string} [title]
 * @property {MenuNode[]} children
 */

/**
 * @param {import('../../shared/types').Property} property
 * @param {string[]} [instancePath]
 */
function getObjectMenuNodes(property, instancePath = []) {
  const menuProperties =
    property.metaInfo.propertyList?.filter(
      (p) => p.type === 'OBJECT' || p.type === 'ARRAY'
    ) ?? []

  /** @type {Array<MenuNode>} */
  const menuStructure =
    menuProperties.map((childProperty) => {
      return {
        title: childProperty.title,
        instancePath: [...instancePath, childProperty.key],
        isArray: childProperty.type === 'ARRAY',
        type: childProperty.type,
        property: childProperty,
        key: childProperty.key,
        children: property.addMenuItemsForChildObjects
          ? getObjectMenuNodes(childProperty, [
              ...instancePath,
              childProperty.key,
            ])
          : [],
      }
    }) ?? []

  return menuStructure
}
