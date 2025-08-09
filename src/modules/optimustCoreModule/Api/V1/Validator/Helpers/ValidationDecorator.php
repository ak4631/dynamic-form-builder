<?php

namespace Optimust\Core\Api\V1\Validator\Helpers;

use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;

class ValidationDecorator
{
    /**
     * @param ParamRule $paramRule
     * @param bool $excludeEmptyString
     * @return ParamRule
     */
    public function requiredParamRule(ParamRule $paramRule, bool $excludeEmptyString = false): ParamRule
    {
        $paramRule->setRules(
            [
                new Rule(Rules::REQUIRED, [$excludeEmptyString]),
                new Rule($paramRule->getCompositeClass(), [...$paramRule->getRules()])
            ]
        );
        $paramRule->setCompositeClass(Rules::ALL_OF);
        return $paramRule;
    }

    /**
     * @param ParamRule $paramRule
     * @param bool $excludeEmptyString If true consider empty string as acceptable value,
     * If false consider empty string as null while validating
     *
     * @return ParamRule
     */
    public function notRequiredParamRule(ParamRule $paramRule, bool $excludeEmptyString = false): ParamRule
    {
        $paramRule->setRules(
            [
                new Rule(Rules::NOT_REQUIRED, [$excludeEmptyString]),
                new Rule($paramRule->getCompositeClass(), [...$paramRule->getRules()])
            ]
        );
        $paramRule->setCompositeClass(Rules::ONE_OF);
        return $paramRule;
    }
}
