<?php

namespace Optimust\Core\Api\V1\Validator;

use Exception;
use Optimust\Core\Api\V1\Exception\InvalidParamException;
use Optimust\Core\Api\V1\Validator\Exceptions\ValidationEscapableException;
use Optimust\Core\Api\V1\Validator\Exceptions\ValidationException;
use Respect\Validation\Rules;

class Validator
{
    /**
     * @param array $values
     * @param ParamRuleCollection|null $rules
     * @return bool
     * @throws InvalidParamException
     */
    public static function validate(array $values, ?ParamRuleCollection $rules = null): bool
    {
        $paramRules = $rules->getMap();
        $paramKeys = array_keys($paramRules);
        $values = self::getOnlyNecessaryValues($values, $rules);

        if ($rules->isStrict()) {
            $paramKeys = array_unique(array_merge($paramKeys, array_keys($values)));
        }

        $errorBag = [];
        foreach ($paramKeys as $paramKey) {
            try {
                if (isset($paramRules[$paramKey])) {
                    $paramRule = $paramRules[$paramKey];

                    $compositeClass = $paramRule->getCompositeClass();
                    $paramValidatorRule = new $compositeClass(...$paramRule->getRules());
                    $paramValidator = new Rules\Key($paramKey, $paramValidatorRule);
                    $paramValidator->check(
                        [$paramKey => $values[$paramKey] ?? $paramRule->getDefault()]
                    );
                } else {
                    throw new InvalidParamException(
                        [],
                        sprintf('Unexpected Parameter (`%s`) Received', $paramKey)
                    );
                }
            } catch (ValidationException | Exception $e) {
                if ($e instanceof ValidationEscapableException) {
                    throw $e;
                }
                $errorBag[$paramKey] = $e;
            }
        }
        if (!empty($errorBag)) {
            throw new InvalidParamException($errorBag);
        }

        return true;
    }

    /**
     * @param array $values
     * @param ParamRuleCollection|null $rules
     * @return array
     */
    private static function getOnlyNecessaryValues(array $values, ?ParamRuleCollection $rules = null): array
    {
        $excludedParamKeys = is_null($rules) ?
            ParamRuleCollection::DEFAULT_EXCLUDED_PARAM_KEYS :
            $rules->getExcludedParamKeys();
        foreach ($excludedParamKeys as $excludedParamKey) {
            unset($values[$excludedParamKey]);
        }
        return $values;
    }
}
