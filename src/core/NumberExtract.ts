export class NumberExtract {
    digit = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 零: 0, 两: 2, 半: 0.5 };
    digit_list = Object.keys(this.digit);

    digit_unit = { 个: 1, 十: 10, 百: 100, 千: 1000, 万: 10000, 亿: 100000000 };
    digit_unit_list = Object.keys(this.digit_unit);


    decimal_detect(query: string) {
        let ArabicNumerals, detect_char;
        const rule_of_number = new RegExp("({0})+点({0})+".replaceAll('{0}', this.digit_list.join('|')));
        let char_new = query;
        const matchStr = char_new.matchAll(rule_of_number);

        // while (re.search(rule_of_number, char_new)) {
        //     detect_char = re.search(rule_of_number, char_new).group();
        //     ArabicNumerals = cls.decimal_transfer(detect_char);
        //     char_new = re.sub(detect_char, ArabicNumerals, char_new, {
        //         "count": 1
        //     });
        //     return char_new;
        // }
    }

    detect(query: string) {
        let char_new;

        try {
            // char_new = cls.decimal_detect(query);
            // char_new = cls.fraction_detect(char_new);
            // char_new = cls.unit_mix_detect(char_new);
            // char_new = cls.integer_detect(char_new);
            return char_new;
        } catch (e) {
            return query;
        }
    }
}
