import {
  faCheckCircle,
  faExclamationTriangle,
  faFile,
  faFileAlt,
  faFolderOpen,
  faMinusSquare,
  faPlusSquare,
  faSave,
  faWindowClose,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import Document from './EditorTab/Document'
import ProductTree from './EditorTab/ProductTree'
import ObjectContainer from './EditorTab/shared/ObjectContainer'
import Vulnerabilities from './EditorTab/Vulnerabilities'
import { useAlert } from './shared/Alert'

/**
 * @param {{
 *  formValues: import('../shared/FormValues').default
 *  validationErrors: import('../../shared/validationTypes').ValidationError[]
 *  onUpdate: ((update: {}) => void) & ((dataPath: string, update: {}) => void)
 *  onOpen(file: File): void
 *  onDownload(doc: {}): void
 *  onNewDocMin(): void
 *  onNewDocMax(): void
 * }} props
 */
export default function FormEditorTab({
  formValues,
  validationErrors: errors,
  onUpdate,
  onOpen,
  onDownload,
  onNewDocMin,
  onNewDocMax,
}) {
  const { doc } = formValues

  const confirmMin = () => {
    onNewDocMin()
    hideMin()
  }

  const confirmMax = () => {
    onNewDocMax()
    hideMax()
  }

  const { show: showMin, hide: hideMin, Alert: MinAlert } = useAlert({
    description:
      'This will create a new CSAF document. All current content will be lost. Are you sure?',
    confirmLabel: 'Yes, create new document',
    cancelLabel: 'No, resume editing',
    confirm: confirmMin,
  })

  const { show: showMax, hide: hideMax, Alert: MaxAlert } = useAlert({
    description:
      'This will create a new CSAF document. All current content will be lost. Are you sure?',
    confirmLabel: 'Yes, create new document',
    cancelLabel: 'No, resume editing',
    confirm: confirmMax,
  })

  const [showErrors, setShowErrors] = React.useState(false)

  const toggleErrors = () => {
    setShowErrors(!showErrors)
    setExpanded(!showErrors)
  }

  React.useEffect(() => {
    if (errors.length === 0) {
      setShowErrors(false)
    }
  }, [errors])

  const ref = React.useRef(/** @type {HTMLDivElement | null} */ (null))
  /** @param {boolean} open */
  const setExpanded = (open) => {
    if (!ref.current) return
    /** @type {NodeListOf<HTMLDetailsElement>} */
    const elements = ref.current.querySelectorAll('.js-collapsible')
    for (const el of elements) {
      el.open = open
    }
  }

  return (
    <>
      <MinAlert />
      <MaxAlert />
      <div ref={ref} className="form-editor flex h-full mr-3 bg-white">
        <div className="p-3 w-full">
          <div className={'overflow-auto ' + (showErrors ? 'h-4/5' : 'h-full')}>
            <ObjectContainer
              label="Common Security Advisory Framework"
              description="Representation of security advisory information as a JSON document."
              dataPath=""
              value={doc}
              collapsible={false}
              deletable={false}
              validationErrors={errors}
              onUpdate={onUpdate}
              defaultValue={() => ({
                document: {},
              })}
            >
              {(csafProps) => (
                <>
                  <Document {...csafProps('document')} />
                  <ProductTree {...csafProps('product_tree')} />
                  <Vulnerabilities {...csafProps('vulnerabilities')} />
                </>
              )}
            </ObjectContainer>
          </div>
          <div
            className={
              'overflow-auto p-3 border border-red-600 bg-red-200 ' +
              (showErrors ? 'h-1/5' : 'hidden')
            }
          >
            <div className="flex justify-between items-start h-full">
              <div className="pr-4">
                <h2 className="text-xl font-bold">
                  Validation <br /> Errors:
                </h2>
              </div>
              <div className="mx-2 flex-grow overflow-auto h-full">
                {errors.map((error, i) => (
                  <div key={i}>
                    <a href={'#' + error.dataPath} className="underline">
                      <b>{error.dataPath}</b>: {error.message}
                    </a>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="text-xl text-red-400"
                onClick={() => setShowErrors(false)}
              >
                <FontAwesomeIcon className="mr-1" icon={faWindowClose} />
              </button>
            </div>
          </div>
        </div>
        <div className="pl-3 pr-6 py-6 w-72 flex flex-col justify-between">
          <div className="flex flex-col">
            <button
              type="button"
              className="mb-2 py-1 px-3 rounded shadow border border-blue-400 bg-blue-400 text-white hover:text-blue-400 hover:bg-white"
              onClick={showMin}
            >
              <FontAwesomeIcon className="mr-1" icon={faFile} />
              New (minimal fields)
            </button>
            <button
              type="button"
              className="mb-2 py-1 px-3 rounded shadow border border-blue-400 bg-blue-400 text-white hover:text-blue-400 hover:bg-white"
              onClick={showMax}
            >
              <FontAwesomeIcon className="mr-1" icon={faFileAlt} />
              New (all fields)
            </button>
            <label
              htmlFor="openFile"
              className="mb-2 py-1 px-3 text-center rounded shadow border border-blue-400 bg-blue-400 text-white hover:text-blue-400 hover:bg-white"
            >
              <FontAwesomeIcon className="mr-1" icon={faFolderOpen} />
              Open
            </label>
            <input
              id="openFile"
              title="open file"
              type="file"
              className="hidden"
              accept="application/json"
              onChange={(e) => {
                if (!e.target.files || !e.target.files[0]) return
                if (e.target.files[0].size > 1 * 1024 * 1024) {
                  window.alert('File too large!')
                  return
                }
                onOpen(e.target.files[0])
              }}
            />
            <button
              type="button"
              className="mb-2 py-1 px-3 rounded shadow border border-blue-400 bg-blue-400 text-white hover:text-blue-400 hover:bg-white"
              onClick={() => {
                onDownload(doc)
              }}
            >
              <FontAwesomeIcon className="mr-1" icon={faSave} />
              Save
            </button>
            <button
              type="button"
              className="mb-2 py-1 px-3 rounded shadow border border-gray-400 bg-gray-400 text-white hover:text-gray-400 hover:bg-white"
              onClick={() => {
                setExpanded(true)
              }}
            >
              <FontAwesomeIcon className="mr-1" icon={faPlusSquare} />
              Expand all
            </button>
            <button
              type="button"
              className="mb-2 py-1 px-3 rounded shadow border border-gray-400 bg-gray-400 text-white hover:text-gray-400 hover:bg-white"
              onClick={() => {
                setExpanded(false)
              }}
            >
              <FontAwesomeIcon className="mr-1" icon={faMinusSquare} />
              Collapse all
            </button>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold">Validation Status</h2>
            {errors.length === 0 ? (
              <>
                <div className="mb-4 flex justify-end">
                  <FontAwesomeIcon
                    className="text-6xl text-green-500"
                    icon={faCheckCircle}
                  />
                </div>
                <div className="h-9" />
              </>
            ) : (
              <div>
                <div className="mb-4 flex justify-between">
                  <span className="text-6xl text-red-500 font-bold">
                    {errors.length}
                  </span>
                  <FontAwesomeIcon
                    className="text-6xl text-red-500"
                    icon={faExclamationTriangle}
                  />
                </div>
                <button
                  type="button"
                  className="py-1 px-3 h-9 underline text-gray-500"
                  onClick={toggleErrors}
                >
                  {showErrors ? 'Hide errors' : 'Show errors'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
