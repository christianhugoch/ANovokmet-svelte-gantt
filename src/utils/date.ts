export interface SvelteGanttDateAdapter {
    format(date: number, format: string): string;
}

export class MomentSvelteGanttDateAdapter implements SvelteGanttDateAdapter {
    moment: any;

    constructor(moment) {
        this.moment = moment;
    }

    format(date: number, format: string): string {
        return this.moment(date).format(format);
    }
}

export class NoopSvelteGanttDateAdapter implements SvelteGanttDateAdapter {
    format(date: number, format: string): string {
        const d = new Date(date);
        switch (format) {
            case 'H':
                return d.getHours() + '';
            case 'HH':
                return pad(d.getHours());
            case 'H:mm':
                return `${d.getHours()}:${pad(d.getMinutes())}`;
            case 'hh:mm':
                return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
            case 'hh:mm:ss':
                return `${d.getHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            case 'dd/MM/yyyy':
                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            case 'dd/MM/yyyy hh:mm':
                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
            case 'dd/MM/yyyy hh:mm:ss':
                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
            default:
                console.warn(`Date Format "${format}" is not supported, use another date adapter.`);
                return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        }
    }
}

function pad(value: number): string {
    let result = value.toString();
    for (let i = result.length; i < 2; i++) {
        result = '0' + result;
    }
    return result;
}

export function startOf(date: number, unit: string): number {
    let unitMs = getDuration(unit);
    const value = Math.floor(date / unitMs) * unitMs;
    return value;
}

export function getDuration(unit: string, offset = 1): number {
    switch (unit) {
        case 'y':
        case 'year':
            return offset * 31536000000;
        case 'month':
            return offset * 30 * 24 * 60 * 60 * 1000;
        case 'd':
        case 'day':
            return offset * 24 * 60 * 60 * 1000;
        case 'h':
        case 'hour':
            return offset * 60 * 60 * 1000;
        case 'm':
        case 'minute':
            return offset * 60 * 1000;
        case 's':
        case 'second':
            return offset * 1000;
        default:
            throw new Error(`Unknown unit: ${unit}`);
    }
}