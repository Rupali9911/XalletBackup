export const REGEX = {
    // eslint-disable-next-line
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    SPECIAL_CHARACTER: /^[^~`!@#$%^&*()+=/*';\\<>?:",]*$/,
    URL: /^((http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
    NUMBER: /^[0-9]\d{0,9}(\.\d{0,6})*(,\d)?$/,
}

const useValidate = () => {
    const validateEmail = (value) => {
        
        if (value === '') {
            return { status: true, message: '' }
        }
        const result = validateMaxLength(value, 255)
        if (!result.status) {
            return result
        }
        if (!REGEX.EMAIL.test(value)) {
            return {
                status: false,
                message: 'INVALID_EMAIL',
            }
        }
        return { status: true, message: '' }
    }

    const validateLink = (value) => {
        if (value === '') {
            return { status: true, message: '' }
        }
        const result = validateMaxLength(value, 255)
        if (!result.status) {
            return result
        }
        if (!REGEX.URL.test(value)) {
            return {
                status: false,
                message: 'INVALID_ZOOM_EMAIL',
            }
        }
        return { status: true, message: '' }
    }

    const validateMaxLength = (value, max) => {
        if (value.length > max) {
            return {
                status: false,
                message: `The value has max length ${max} characters`,
            }
        }
        return { status: true, message: '' }
    }

    const validateMinLength = (value, min) => {
        if (value.length < min) {
            return {
                status: false,
                message: `The value has min length ${min} characters`,
            }
        }
        return { status: true, message: '' }
    }

    const validateLength = (value, min, max) => {
        if (value.length < min || value.length > max) {
            return {
                status: false,
                message: `Display Name has length from ${min} to ${max} characters!`,
            }
        }
        return { status: true, message: '' }
    }

    const validateNumber = (value) => {
        if (value.length > 0) {
            if (!REGEX.NUMBER.test(value) || value.split('.').length >= 3) {
                return {
                    status: false,
                    message: `hong be oi`,
                }
            }
        }
        return { status: true, message: '' }
    }

    return {
        validateEmail,
        validateMaxLength,
        validateMinLength,
        validateLength,
        validateLink,
        validateNumber,
    }
}

export default useValidate
