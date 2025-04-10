export function getTagColor(tag: string | { color: string }): string {
    if (typeof tag === 'object' && tag.color) {
        switch (tag.color.toLowerCase()) {
            case 'white':
                return 'secondary';
            case 'green':
                return 'success';
            case 'blue':
                return 'info';
            case 'orange':
                return 'warn';
            case 'red':
                return 'danger';
            case 'black':
                return 'contrast';
            default:
                return 'secondary';
        }
    }
    return 'secondary';
}
