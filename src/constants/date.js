export const getExpirationDate = expired => {
    const expirationTime = new Date(expired * 1000).getTime()
    const nowTime = Date.now()
    if (nowTime > expirationTime) {
        return 'Expired'
    } else {
        const differenceTimes = expirationTime - nowTime
        const differenceDays = differenceTimes / (1000 * 3600 * 24)

        if (Math.floor(differenceDays) > 0) {
            return `${Math.round(differenceDays)} days`
        }

        const differenceHours = differenceTimes / (1000 * 3600)
        if (Math.floor(differenceHours) > 0) {
            return `about ${Math.round(differenceHours)} hours`
        }

        const differenceMinutes = differenceTimes / (1000 * 60)
        return `about ${Math.round(differenceMinutes) || 1} minutes`
    }
}

export const getDateString = dateInput => {
    const pad2 = n => {
        return n < 10 ? '0' + n : n
    }
    const date = new Date(dateInput)
    return (
        date.getFullYear().toString() +
        '/' +
        pad2(date.getMonth() + 1) +
        '/' +
        pad2(date.getDate()) +
        ' ' +
        pad2(date.getHours()) +
        ':' +
        pad2(date.getMinutes()) +
        ':' +
        pad2(date.getSeconds())
    )
}
