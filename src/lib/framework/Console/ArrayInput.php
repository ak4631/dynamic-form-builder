<?php

namespace Optimust\Framework\Console;

use Symfony\Component\Console\Input\InputDefinition;

class ArrayInput extends \Symfony\Component\Console\Input\ArrayInput
{
    private array $parameters;

    public function __construct(array $parameters, InputDefinition $definition = null)
    {
        $this->parameters = $parameters;
        parent::__construct($parameters, $definition);
    }

    /**
     * @return array
     */
    public function getRawParameters(): array
    {
        return $this->parameters;
    }
}
