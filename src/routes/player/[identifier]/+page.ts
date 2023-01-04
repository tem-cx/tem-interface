export const load = (({ params }: { params: { identifier: string } }): object => {
    if (params.identifier.length > 16) {
        return {
            uuid: params.identifier.replace(/-/g, '')
        }
    } else {
        return {
            username: params.identifier,
        }
    }
});