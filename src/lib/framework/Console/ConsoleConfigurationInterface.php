<?php

namespace Optimust\Framework\Console;

interface ConsoleConfigurationInterface
{
    /**
     * @param Console $console
     */
    public function registerCommands(Console $console): void;
}
