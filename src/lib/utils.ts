/**
 * ISO形式の日付文字列を「YYYY年MM月DD日」形式にフォーマット
 */
export function formatDate(isoDateString: string): string {
    if (!isoDateString) return '';

    try {
        const date = new Date(isoDateString);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
        console.error('日付フォーマットエラー:', e);
        return isoDateString;
    }
}

/**
 * エラーメッセージを取得する
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

/**
 * 文字列を省略して表示する
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * 配列をグループ化する
 */
export function groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
    return array.reduce((acc: Record<string, T[]>, item: T) => {
        const key = keyGetter(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
}