import type { INumberRuleOption } from './core/number_rule';
import type { INumberExtractOption } from './core/number_extract';

type IOption = INumberRuleOption & INumberExtractOption;

declare function CreateParser(option?: IOption): {
    parse(query: string);
};

export { IOption as IOptionParser, CreateParser };
