


export function makeHttpError({ ...error }) {
    return error
}

export async function internalError(serviceFunc, res) {

    return serviceFunc.then(({ headers, statusCode, data }) => res
        .set(headers)
        .status(statusCode)
        .send(data)
        .catch(e => res.status(500).end()));
}