<?php

namespace Optimust\Framework\Console\Scheduling;

use Crunz\Event;
use Optimust\Framework\Console\ArrayInput;
use Optimust\Framework\Console\Command;
use Optimust\Framework\Console\Console;
use Optimust\Framework\Logger\LoggerFactory;
use Symfony\Component\Console\Output\OutputInterface;
use Throwable;

class Task extends Event
{
    private Console $console;
    private OutputInterface $commandOutput;
    private CommandInfo $commandInfo;
    private Command $consoleCommand;

    public function __construct(string $id, CommandInfo $commandInfo, Console $console, OutputInterface $output)
    {
        $this->commandInfo = $commandInfo;
        $this->console = $console;
        $this->commandOutput = $output;

        $this->consoleCommand = $this->console->find($this->commandInfo->getCommand());
        parent::__construct($id, '');
    }

    /**
     * Return exit code
     *
     * @return int
     */
    public function start(): int
    {
        $input = $this->commandInfo->getInput() ?? new ArrayInput([]);
        try {
            return $this->consoleCommand->run($input, $this->commandOutput);
        } catch (Throwable $e) {
            $logger = LoggerFactory::getLogger('scheduler');
            $logger->error($e->getMessage());
            $logger->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }

    /**
     * @return CommandInfo
     */
    public function getCommand(): CommandInfo
    {
        return $this->commandInfo;
    }
}
