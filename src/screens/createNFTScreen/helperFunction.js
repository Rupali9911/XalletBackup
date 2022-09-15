//================== TimeSince Function =================
export function timeSince(date) {
    const t = Math.abs(date.getTime() - Date.now())

    var seconds = Math.floor(t / 1000)

    var interval = seconds / 31536000

    if (interval > 1) {
        return Math.floor(interval) + ' years'
    }
    interval = seconds / 2592000
    if (interval > 1) {
        return Math.floor(interval) + ' months'
    }
    interval = seconds / 86400
    if (interval > 1) {
        return Math.floor(interval) + ' days'
    }
    interval = seconds / 3600
    if (interval > 1) {
        return Math.floor(interval) + ' hours'
    }
    interval = seconds / 60
    if (interval > 1) {
        return Math.floor(interval) + ' minutes'
    }
    return Math.floor(seconds) + ' seconds'
}

//================== To Fixx Custom Function =================
export const toFixCustom = (x) => {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x?.toString().split('e-')[1])
        if (e) {
            x *= Math.pow(10, e - 1)
            x = '0.' + new Array(e).join('0') + x.toString().substring(2)
        }
    } else {
        var e = parseInt(x?.toString().split('+')[1])
        if (e > 20) {
            e -= 20
            x /= Math.pow(10, e)
            x += new Array(e + 1).join('0')
        }
    }
    return Number(Number(x).toFixed(6))
}

export const roundNumber = (num, fixedLength) => {
    const number =
        Math.round(num * Math.pow(10, fixedLength)) / Math.pow(10, fixedLength)
    return number
}
