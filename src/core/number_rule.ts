export interface INumberRuleOption {
    onlyPickMax?: boolean;
}

export class Number_rule {
    // 是否只拾取最大值
    onlyPickMax = false;

    constructor(option?: INumberRuleOption) {
        this.onlyPickMax = option?.onlyPickMax ?? this.onlyPickMax;
    }

    // 常见的计量单位及同义词转换
    measure_dict: Record<string, any> = {
        length: {
            米: 1,
            m: 1,
            千米: 1000,
            公里: 1000,
            km: 1000,
            里: 500,
            厘米: 0.01,
            cm: 0.01,
            毫米: 0.001,
            mm: 0.001,
            std: 'm'
        },
        weight: { 千克: 1, kg: 1, 公斤: 1, 斤: 0.5, 克: 0.001, g: 0.001, std: 'kg' },
        time: { 秒: 1, s: 1, 小时: 3600, h: 3600, 分钟: 60, min: 60, std: 's' },
        temperature: { 摄氏度: 1, 度: 1, '℃': 1, std: '℃' },
        money: { 元: 1, 块: 1, 元钱: 1, 块钱: 1, 角: 0.1, 分: 0.01, 分钱: 0.01, std: '元' },
        people: { 人: 1, 位: 1, std: '人' },
        area: { 平方米: 1, 平米: 1, 平方千米: 1000, 亩: 666, std: '平方米' }
    };

    /**
     * 输出std结果集
     * @param query
     */
    getStdResult(query: string) {
        let obj: Record<string, number[]> = {};
        const keys = Object.keys(this.measure_dict);

        for (const key of keys) {
            const item = this.measure_dict[key];
            const arr = [];

            for (const unit of Object.keys(item)) {
                if (unit !== 'std') {
                    arr.push(unit);
                }
            }

            const unit_re = new RegExp(`(?<${key}>(\\d+))(${arr.join('|')})`, 'g');
            const matchArr = query.matchAll(unit_re);

            for (const match of matchArr) {
                const unit_std = this.measure_dict[key]['std'];
                const unit = match[match.length - 1];

                const unit_std_val = item[unit_std];
                const unit_match_val: undefined | string = match.groups?.[key];
                const unit_convert_val = item[unit];

                if (unit_match_val !== undefined) {
                    const unit_val_convert_to_std = unit_std_val * Number(unit_match_val) * unit_convert_val;

                    if (!obj[key]) {
                        obj[key] = [unit_val_convert_to_std];
                    } else {
                        obj[key].push(unit_val_convert_to_std);
                        obj[key] = [...new Set(obj[key])]; // 去重
                    }

                    if (this.onlyPickMax) {
                        obj[key] = [Math.max(...obj[key])]; // 取最大值
                    }
                }
            }
        }

        return obj;
    }
}
