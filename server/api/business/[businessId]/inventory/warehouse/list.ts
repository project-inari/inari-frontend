export default defineEventHandler(async event => {
    const businessId = getRouterParam(event, 'businessId');
    console.log(businessId);

    const warehouseList: any[] = [
        {
            id: 1,
            name: 'Warehouse 1',
            pictureUrl: 'https://www.mintsoft.com/media/chzlxsn3/types_of_warehouse_blog.png?width=1200&height=630&v=1dab8149acd8d70',
        },
        {
            id: 2,
            name: 'Warehouse 2',
            pictureUrl: 'https://b1883154.smushcdn.com/1883154/wp-content/uploads/2021/07/image-1200x800-1.jpeg?lossy=2&strip=1&webp=1',
        },
    ];

    return warehouseList;
});
