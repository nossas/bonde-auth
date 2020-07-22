import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface Template {
  subject_template: string
  body_template: string
}

export interface FilterTemplate {
  locale: string
  label: string
}

export const findTemplate = async (filter: FilterTemplate): Promise<Template> => {
  const FilterNotificationTemplateQuery = gql`
		query findTemplate ($where: notification_templates_bool_exp) {
		  notification_templates(where: $where) {
		    subject_template
		    body_template
		  }
		}
	`

  const where = { label: { _eq: filter.label }, locale: { _ilike: filter.locale } }
  const resp = await GraphQLAPI.query({ query: FilterNotificationTemplateQuery, variables: { where }, fetchPolicy: 'network-only' })
  if (resp.data && resp.data.notification_templates.length > 0) {
    return resp.data.notification_templates[0]
  }
  throw new Error('template_not_found')
}

// "reset_password_instructions"

export interface Notify {
  email_to: string
  email_from: string
  subject?: string
  body?: string
  context?: object
}

export interface NotifyResponse {
  status: any
}

export const send = async (input: Notify, template?: FilterTemplate): Promise<NotifyResponse> => {
  if (!!template) {
    const { subject_template, body_template } = await findTemplate(template)
    input.subject = subject_template
    input.body = body_template
  }

  const insertMailMutation = gql`
    mutation SendMail ($input: [NotifyInput!]!){
      notify(input: $input) {
        status
      }
    }
  `

  const resp = await GraphQLAPI.mutate({ mutation: insertMailMutation, variables: { input } })

  return resp.data
}