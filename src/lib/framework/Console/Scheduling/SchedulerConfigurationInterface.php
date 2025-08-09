<?php

namespace Optimust\Framework\Console\Scheduling;

interface SchedulerConfigurationInterface
{
    /**
     * @param Schedule $schedule
     */
    public function schedule(Schedule $schedule): void;
}
