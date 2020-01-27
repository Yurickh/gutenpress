import { get } from 'gutenpress'
import { getContactDetails } from './get'

export const contactDetails = get('/contact-details', getContactDetails)
