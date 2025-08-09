<?php

namespace Optimust\Core\Api\V1\Validator;

class ParamRule
{
    /**
     * @var string
     */
    protected string $paramKey;

    /**
     * @var Rule[]
     */
    protected array $rules;

    /**
     * @var null|mixed
     */
    protected $default = null;

    /**
     * @var string
     */
    protected string $compositeClass = Rules::ALL_OF;

    /**
     * @param string $paramKey
     * @param Rule ...$rules
     */
    public function __construct(string $paramKey, Rule ...$rules)
    {
        $this->paramKey = $paramKey;
        $this->rules = $rules;
    }

    /**
     * @return string
     */
    public function getParamKey(): string
    {
        return $this->paramKey;
    }

    /**
     * @param string $paramKey
     */
    public function setParamKey(string $paramKey): void
    {
        $this->paramKey = $paramKey;
    }

    /**
     * @return Rule[]
     */
    public function getRules(): array
    {
        return $this->rules;
    }

    /**
     * @param Rule[] $rules
     */
    public function setRules(array $rules): void
    {
        $this->rules = $rules;
    }

    /**
     * @return mixed|null
     */
    public function getDefault()
    {
        return $this->default;
    }

    /**
     * @param mixed|null $default
     */
    public function setDefault($default): void
    {
        $this->default = $default;
    }

    /**
     * @return string
     */
    public function getCompositeClass(): string
    {
        return $this->compositeClass;
    }

    /**
     * @param string $compositeClass
     * @throws ValidatorException
     */
    public function setCompositeClass(string $compositeClass): void
    {
        $allowed = [Rules::ALL_OF, Rules::ONE_OF, Rules::ANY_OF, Rules::NONE_OF];
        if (!in_array($compositeClass, $allowed)) {
            throw new ValidatorException(
                sprintf('Expected one of `%s`. But got `%s`.', implode('`, `', $allowed), $compositeClass)
            );
        }
        $this->compositeClass = $compositeClass;
    }
}
