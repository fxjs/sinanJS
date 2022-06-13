import type { INumberRuleOption } from './core/number_rule';
import type { INumberExtractOption } from './core/number_extract';

type IOption = INumberRuleOption & INumberExtractOption;

declare class CreateParser {
    constructor(option?: IOption);
    parse(query: string): Record<string, number[]>;
}

export { IOption as IOptionParser, CreateParser };
