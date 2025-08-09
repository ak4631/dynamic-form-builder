<?php

namespace Optimust\Core\Api\V1\Validator\Rules\Composite;

use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules\AbstractRule;
use ReflectionClass;
use ReflectionException;

abstract class AbstractComposite extends AbstractRule
{
    /**
     * @var Rule[]
     */
    protected array $rules;

    /**
     * @param Rule ...$rules
     */
    public function __construct(Rule ...$rules)
    {
        $this->rules = $rules;
    }

    /**
     * @param mixed $input
     * @return bool
     * @throws ReflectionException
     */
    public function validate($input): bool
    {
        $ruleClasses = [];
        foreach ($this->rules as $rule) {
            $params = $rule->getRuleConstructorParams();
            if (!is_array($params)) {
                $params = [];
            }
            $ruleClasses[] = (new ReflectionClass($rule->getRuleClass()))->newInstanceArgs($params);
        }
        $compositeRuleClass = $this->getRuleClass();
        /** @var AbstractComposite $paramValidatorRule */
        $paramValidatorRule = new $compositeRuleClass(...$ruleClasses);
        return $paramValidatorRule->validate($input);
    }

    /**
     * @return string
     */
    abstract protected function getRuleClass(): string;
}
