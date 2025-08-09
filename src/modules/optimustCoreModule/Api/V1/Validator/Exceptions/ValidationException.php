<?php

namespace Optimust\Core\Api\V1\Validator\Exceptions;

use InvalidArgumentException;
use Optimust\Core\Api\V1\Validator\Rules\AbstractRule;

class ValidationException extends InvalidArgumentException
{
    /**
     * @var mixed
     */
    protected $input = null;

    /**
     * @var null|AbstractRule
     */
    protected ?AbstractRule $rule = null;

    /**
     * @param $input
     * @param AbstractRule $rule
     * @param string $message
     */
    public function __construct($input, AbstractRule $rule, $message = "")
    {
        $this->input = $input;
        $this->rule = $rule;
        parent::__construct($message);
    }

    /**
     * @return mixed
     */
    public function getInput()
    {
        return $this->input;
    }

    /**
     * @param mixed $input
     */
    public function setInput($input): void
    {
        $this->input = $input;
    }

    /**
     * @return AbstractRule|null
     */
    public function getRule(): ?AbstractRule
    {
        return $this->rule;
    }

    /**
     * @param AbstractRule|null $rule
     */
    public function setRule(?AbstractRule $rule): void
    {
        $this->rule = $rule;
    }
}
