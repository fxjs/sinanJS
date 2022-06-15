export interface IDict {
    std: string;
    [index: string]: string | number;
}

export interface INumberRuleOption {
    onlyPickMax?: boolean;
    measureDict: Record<string, IDict>;
}

export class Number_rule {
    // 是否只拾取最大值
    onlyPickMax = false;
    // 常见的计量单位及同义词转换
    measure_dict: Record<string, any>;

    constructor(option: INumberRuleOption) {
        this.onlyPickMax = option.onlyPickMax ?? this.onlyPickMax;
        // 字典
        this.measure_dict = option.measureDict;
    }

    /**
     * 输出std结果
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

            const unit_re = new RegExp(`(?<${key}>(\\d+))多?(${arr.join('|')})`, 'g');
            const matchArr = query.matchAll(unit_re);

            for (const match of matchArr) {
                const unit_std = this.measure_dict[key]['std'];
                const unit = match[match.length - 1];

                const unit_std_val = item[unit_std];
                const unit_match_val: undefined | string = match.groups?.[key];
                const unit_convert_val = item[unit];

                // 字典没有配置std键
                if (unit_std === undefined) {
                    console.warn(`DICT.${key} missed 'std' prop`);
                    continue;
                }

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
