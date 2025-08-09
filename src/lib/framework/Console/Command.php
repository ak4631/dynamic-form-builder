<?php

namespace Optimust\Framework\Console;

use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

abstract class Command extends \Symfony\Component\Console\Command\Command
{
    protected ?SymfonyStyle $io = null;

    public function __construct()
    {
        parent::__construct($this->getCommandName());
    }

    /**
     * @return SymfonyStyle
     */
    protected function getIO(): SymfonyStyle
    {
        return $this->io;
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     */
    protected function setIO(InputInterface $input, OutputInterface $output): void
    {
        $this->io = new SymfonyStyle($input, $output);
    }

    /**
     * @inheritDoc
     */
    public function run(InputInterface $input, OutputInterface $output): int
    {
        $this->setIO($input, $output);
        return parent::run($input, $output);
    }

    /**
     * @return string
     */
    abstract public function getCommandName(): string;
}
