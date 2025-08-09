<?php

namespace Optimust\Framework\Console\Scheduling;

use Optimust\Framework\Console\ArrayInput;

class CommandInfo
{
    private string $command;
    private ?ArrayInput $input;

    /**
     * @param string $command
     * @param ArrayInput|null $input e.g. $input = new ArrayInput(['arg1' => 'buz', 'foo' => 'bar', '--bar' => 'foobar']);
     */
    public function __construct(string $command, ?ArrayInput $input = null)
    {
        $this->command = $command;
        $this->input = $input;
    }

    /**
     * @return string
     */
    public function getCommand(): string
    {
        return $this->command;
    }

    /**
     * @return ArrayInput|null
     */
    public function getInput(): ?ArrayInput
    {
        return $this->input;
    }
}
