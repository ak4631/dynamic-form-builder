<?php

namespace Optimust\Core\Api\V1\Validator;

class Rule
{
    /**
     * @var string
     */
    protected string $ruleClass;

    /**
     * @var array
     */
    protected array $ruleConstructorParams;

    /**
     * @var string|null
     */
    protected ?string $message;

    /**
     * @param string $ruleClass
     * @param array $ruleConstructorParams
     * @param string|null $message
     */
    public function __construct(string $ruleClass, array $ruleConstructorParams = [], ?string $message = null)
    {
        $this->ruleClass = $ruleClass;
        $this->ruleConstructorParams = $ruleConstructorParams;
        $this->message = $message;
    }

    /**
     * @return string
     */
    public function getRuleClass(): string
    {
        return $this->ruleClass;
    }

    /**
     * @param string $ruleClass
     */
    public function setRuleClass(string $ruleClass): void
    {
        $this->ruleClass = $ruleClass;
    }

    /**
     * @return array
     */
    public function getRuleConstructorParams(): array
    {
        return $this->ruleConstructorParams;
    }

    /**
     * @param array $ruleConstructorParams
     */
    public function setRuleConstructorParams(array $ruleConstructorParams): void
    {
        $this->ruleConstructorParams = $ruleConstructorParams;
    }

    /**
     * @return string|null
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param string|null $message
     */
    public function setMessage(?string $message): void
    {
        $this->message = $message;
    }
}
