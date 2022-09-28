import { CREATED_DRAFT_TYPES } from '../constants/filters'

export const formatCreatedDraft = (status) => {
    const option = CREATED_DRAFT_TYPES.find((t) => t.value === status)
    return option?.title
}

export const getTokenNameFromId = (id, tokens) => {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].id === id) {
            return tokens[i].tokenName
        }
    }
    return ''
}
