import { Number_extract } from './number_extract';
import { Number_rule } from './number_rule';
import type { INumberRuleOption } from './number_rule';
import type { INumberExtractOption } from './number_extract';

type IOption = INumberRuleOption & INumberExtractOption;

export class CreateParser {
    private numberExtract;
    private numberRule;

    // 配置
    constructor(option?: IOption) {
        this.numberExtract = new Number_extract(option);
        this.numberRule = new Number_rule(option);
    }

    // 解析
    parse(query: string) {
        const char_new = this.numberExtract.detect(query);
        const data = this.numberRule.getStdResult(char_new);

        return data;
    }
}
