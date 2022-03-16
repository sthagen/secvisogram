import React from 'react'
import ArrayContainer from '../../shared/ArrayContainer'
import DateAttribute from '../../shared/DateAttribute'
import { Version } from '../../shared/definitions'
import ObjectContainer from '../../shared/ObjectContainer'
import TextAreaAttribute from '../../shared/TextAreaAttribute'

/**
 * @param {{
 *  validationErrors: import('../../../../../shared/validationTypes').ValidationError[]
 *  instancePath: string
 *  value: unknown
 *  onUpdate(instancePath: string, update: {}): void
 * }} props
 */
export default function RevisionHistory(props) {
  return (
    <ArrayContainer
      {...props}
      label="Revision history"
      description="Holds one revision item for each version of the CSAF document, including the initial one."
      defaultItemValue={() => ({
        date: '',
        number: '',
        summary: '',
      })}
    >
      {(revisionHistoryProps) => (
        <ObjectContainer
          {...revisionHistoryProps}
          label="Revision"
          description="Contains all the information elements required to track the evolution of a CSAF document."
        >
          {(revisionHistoryItemProps) => (
            <>
              <DateAttribute
                {...revisionHistoryItemProps('date')}
                label="Date of the revision"
                description="The date of the revision entry"
              />
              <TextAreaAttribute
                {...revisionHistoryItemProps('legacy_revision')}
                label="Legacy version of the revision"
                description="Contains the version string used in an existing document with the same content."
                deletable
              />
              <Version {...revisionHistoryItemProps('number')} />
              <TextAreaAttribute
                {...revisionHistoryItemProps('summary')}
                label="Summary of the revision"
                description="Holds a single non-empty string representing a short description of the changes."
                placeholder="Initial version."
              />
            </>
          )}
        </ObjectContainer>
      )}
    </ArrayContainer>
  )
}
