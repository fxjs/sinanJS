import _indexOf from 'lodash-es/indexOf';
import _lastIndexOf from 'lodash-es/lastIndexOf';

export interface INumberExtractOption {
    measureUnit: string[];
}

export class Number_extract {
    readonly digit: Record<string, number> = {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        零: 0,
        两: 2,
        半: 0.5
    };
    readonly digit_list = Object.keys(this.digit);

    readonly digit_unit: Record<string, number> = {
        个: 1,
        十: 10,
        百: 100,
        千: 1000,
        万: 10000,
        亿: 100000000
    };

    readonly digit_unit_list: string[];

    readonly other_unit_list: string[] = [];

    constructor(option: INumberExtractOption) {
        for (const unit of option.measureUnit) this.other_unit_list.push(unit);

        this.digit_unit_list = Object.keys(this.digit_unit);
    }

    private decimal_detect(query: string): string {
        const rule_of_number = new RegExp('({0})+(?<deci_str>点({0})+)'.replaceAll('{0}', this.digit_list.join('|')));
        let char_new = query;

        while (char_new.match(rule_of_number)) {
            const mat = char_new.match(rule_of_number);

            if (mat && mat.groups) {
                const detect_char = mat.groups['deci_str'];
                if (detect_char) {
                    const ArabicNumerals = this.decimal_transfer(detect_char);
                    char_new = char_new.replace(detect_char, ArabicNumerals.slice(1));
                }
            }
        }

        return char_new;
    }

    private decimal_transfer(detect_char: string): string {
        let [integer_char, decimal_char] = detect_char.split('点');
        let integer_num = this.base_transfer(integer_char);
        let decimal_num = this.base_transfer(decimal_char);
        let decimal_num_temp = Math.floor(Number(decimal_num)) / 10 ** decimal_num.length;
        let number = Math.floor(Number(integer_num)) + decimal_num_temp;

        return number + '';
    }

    private base_transfer(detect_char: string): string {
        // 最基本的汉字数字转换方法，如果无单位就直接拼接，如果有单位就按单位计算
        const rule_of_number = new RegExp('({})+'.replace('{}', this.digit_unit_list.join('|')));
        let char_new;

        if (!detect_char.match(rule_of_number)) {
            char_new = detect_char;
            for (const k of this.digit_list) {
                const v = this.digit[k];
                char_new = char_new.replace(k, String(v));
            }
        } else if (['百', '千', '万', '亿'].includes(detect_char)) {
            char_new = String(this.digit_unit[detect_char]);
        } else {
            char_new = String(this.unitchar2num(detect_char));
        }

        return char_new;
    }

    private unitchar2num(detect_char: string): string {
        detect_char = detect_char.replace('零', '');
        let idx_y = _lastIndexOf(detect_char, '亿');
        let idx_w = _lastIndexOf(detect_char, '万');

        if (idx_w < idx_y) idx_w = -1;

        let [num_y, num_w] = [100000000, 10000];

        if (idx_y !== -1 && idx_w !== -1) {
            const n1 = +this.unitchar2num(detect_char.substring(0, idx_y)) * num_y;
            const n2 = +this.unitchar2num_lower(detect_char.substring(idx_y + 1, idx_w)) * num_w;
            const n3 = +this.unitchar2num_lower(detect_char.substring(idx_w + 1));

            return n1 + n2 + n3 + '';
        } else if (idx_y !== -1) {
            return (
                +this.unitchar2num(detect_char.substring(0, idx_y)) * num_y +
                +this.unitchar2num_lower(detect_char.substring(idx_y + 1)) +
                ''
            );
        } else if (idx_w !== -1) {
            const n1 = +this.unitchar2num_lower(detect_char.substring(0, idx_w)) * num_w;
            const n2 = +this.unitchar2num_lower(detect_char.substring(idx_w + 1));

            return n1 + n2 + '';
        }

        return this.unitchar2num_lower(detect_char);
    }

    private unitchar2num_lower(s: string): string {
        let num = 0;
        let [idx_q, idx_b, idx_s, idx_one] = [
            _indexOf(s, '千'),
            _indexOf(s, '百'),
            _indexOf(s, '十'),
            _indexOf(s, '个')
        ];

        if (idx_q !== -1) num += this.digit[s.substring(idx_q - 1, idx_q)] * 1000;
        if (idx_b !== -1) num += this.digit[s.substring(idx_b - 1, idx_b)] * 100;
        if (idx_s != -1) num += (this.digit[s.substring(idx_s - 1, idx_s)] ?? 1) * 10;
        if (idx_one !== -1 && s.indexOf('个') > 0 && _indexOf(this.digit_unit_list, s[s.indexOf('个') - 1]) === -1) {
            num += this.digit[s.substring(idx_one - 1, idx_one)] ?? 1;
        }
        if (this.digit_list.includes(s.slice(-1))) {
            num += this.digit[s.slice(-1)] || 0;
        }

        return (num || '') + '';
    }

    private fraction_detect(query: string): string {
        const num_and_unit_list = this.digit_list.concat(this.digit_unit_list);
        const rule_of_number = new RegExp('({0})+分之({0})+'.replaceAll('{0}', num_and_unit_list.join('|')));
        let char_new = query;

        while (char_new.match(rule_of_number)) {
            const detect_char = char_new.match(rule_of_number)![0];
            const ArabicNumerals = this.fraction_transfer(detect_char);
            char_new = char_new.replace(detect_char, ArabicNumerals);
        }

        return char_new;
    }

    private fraction_transfer(detect_char: string): string {
        if (detect_char === '个') return '';

        const re = /([亿万千百十个])/g;

        if (!re.test(detect_char)) {
            detect_char = detect_char.slice(-1); // 不带单位的取最后一位
        }

        let [denominator_char, numerator_char] = detect_char.split('分之');
        let fraction_num;

        if (numerator_char !== undefined) {
            let numerator = this.base_transfer(numerator_char);
            let denominator = this.base_transfer(denominator_char);
            fraction_num = Math.floor(Number(numerator)) / Math.floor(Number(denominator));
        } else {
            let numerator = this.base_transfer(denominator_char);
            fraction_num = Math.floor(Number(numerator));
        }

        return fraction_num + '';
    }

    private unit_mix_detect(query: string): string {
        const mix_rule =
            /(?<base_num>\d+(.\d+)?)(?<base_unit>(万亿|千亿|百亿|十亿|亿|千万|百万|十万|万|千|百))(?<res_num>\d+)?/;
        let char_new = query;

        while (char_new.match(mix_rule)) {
            const mix_content = char_new.match(mix_rule);
            const base_num = mix_content?.groups!['base_num'] || '';
            const base_unit = mix_content?.groups!['base_unit'] || '';
            const res_num = mix_content?.groups!['res_num'] ?? '0';
            const base_unit_num = this.unitchar2num(['一', base_unit].join(''));
            const mix_num =
                parseFloat(base_num) * parseFloat(base_unit_num) +
                parseFloat(res_num) * parseFloat(base_unit_num) * 10 ** -res_num.length;

            char_new = char_new.replace(mix_rule, mix_num + '');
        }

        return char_new;
    }

    private integer_detect(query: string): string {
        const num_and_unit_list = this.digit_list.concat(this.digit_unit_list);
        const rule_of_number = new RegExp('({})+'.replaceAll('{}', num_and_unit_list.join('|')));
        let char_new = query;

        while (char_new.match(rule_of_number)) {
            let detect_char = char_new.match(rule_of_number)![0];

            const ArabicNumerals = this.fraction_transfer(detect_char);

            if (!Number.isNaN(+ArabicNumerals)) {
                char_new = char_new.replace(detect_char, ArabicNumerals);
            } else {
                break;
            }
        }

        return char_new;
    }

    detect(query: string): string {
        let char_new;

        try {
            char_new = this.decimal_detect(query);
            char_new = this.fraction_detect(char_new);
            char_new = this.unit_mix_detect(char_new);
            char_new = this.integer_detect(char_new);

            return char_new;
        } catch (e) {
            return query;
        }
    }
}
