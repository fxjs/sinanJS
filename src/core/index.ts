import { Number_extract } from './number_extract';
import { Number_rule } from './number_rule';
import type { INumberExtractOption } from './number_extract';
import type { IDict, INumberRuleOption } from './number_rule';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';
import { BASE_DICT } from './baseDict';

type IOption = INumberRuleOption & INumberExtractOption;

export class CreateParser {
    private numberExtract;
    private numberRule;

    // 配置
    constructor(option?: IOption) {
        const dict = this.getMeasureDict(option);
        const unit = this.getMeasureUnit(dict);
        const _opt = _merge(option, { measureDict: dict, measureUnit: unit });

        this.numberExtract = new Number_extract(_opt);
        this.numberRule = new Number_rule(_opt);
    }

    // 解析
    parse(query: string) {
        return this.numberExtract.detect(query);
    }

    // 提取
    pick(query: string) {
        const char_new = this.parse(query);

        return this.numberRule.getStdResult(char_new);
    }

    // 合并字典
    getMeasureDict(option?: IOption) {
        return option?.measureDict ? _merge(_cloneDeep(BASE_DICT), option?.measureDict || {}) : _cloneDeep(BASE_DICT);
    }

    // 字典量词列表
    getMeasureUnit(dict: Record<string, IDict>) {
        return ['平方米', '楼'];
    }
}
