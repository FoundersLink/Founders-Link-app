export default function resultReponse(code, result) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: code,
        data: JSON.stringify(result)
    };
}
