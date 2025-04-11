export default defineEventHandler(async (event) => {
    const businessId = getRouterParam(event, 'businessId')
    console.log(businessId)
    const query = getQuery(event)
    const supplierId = query.supplierId

    const supplierInfo = {
        id: supplierId,
        name: `Supplier ${supplierId}`,
        type: 'Beverage'
    }

    return supplierInfo
})
