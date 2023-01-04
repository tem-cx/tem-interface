export const load = (({ params }: { params: { uuid: string } }): typeof params => {
    return params;
});