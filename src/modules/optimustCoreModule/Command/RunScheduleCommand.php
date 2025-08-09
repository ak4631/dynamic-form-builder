<?php

namespace Optimust\Core\Command;

use DateTime;
use DateTimeZone;
use Optimust\Config\Config;
use Optimust\Core\Service\DateTimeHelperService;
use Optimust\Core\Traits\ORM\EntityManagerTrait;
use Optimust\Core\Traits\Service\DateTimeHelperTrait;
use Optimust\Entity\TaskSchedulerLog;
use Optimust\Framework\Console\Command;
use Optimust\Framework\Console\Scheduling\Schedule;
use Optimust\Framework\Console\Scheduling\SchedulerConfigurationInterface;
use Optimust\Framework\Logger\LoggerFactory;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\NullOutput;
use Symfony\Component\Console\Output\OutputInterface;
use Throwable;

class RunScheduleCommand extends Command
{
    use DateTimeHelperTrait;
    use EntityManagerTrait;

    /**
     * @inheritDoc
     */
    public function getCommandName(): string
    {
        return 'optimust:run-schedule';
    }

    /**
     * @inheritDoc
     */
    protected function configure()
    {
        $this->setDescription('Running the scheduler');
    }

    /**
     * @inheritDoc
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!$input->getOption('verbose')) {
            $output = new NullOutput();
            $this->setIO($input, $output);
        }
        $pluginConfigs = Config::get('module_configs');
        $schedule = new Schedule($this->getApplication(), $output);
        foreach (array_values($pluginConfigs) as $pluginConfig) {
            $configClass = new $pluginConfig['classname']();
            if ($configClass instanceof SchedulerConfigurationInterface) {
                try {
                    $configClass->schedule($schedule);
                } catch (Throwable $e) {
                    $logger = LoggerFactory::getLogger('scheduler');
                    $logger->error($e->getMessage());
                    $logger->error($e->getTraceAsString());
                }
            }
        }

        $dueTasks = $schedule->getDueTasks(new DateTimeZone(DateTimeHelperService::TIMEZONE_UTC));
        $this->getIO()->note('Time: ' . (new DateTime())->format('Y-m-d H:i:s O'));
        $this->getIO()->note('Event count: ' . count($dueTasks));
        foreach ($dueTasks as $task) {
            $taskLog = new TaskSchedulerLog();
            $taskLog->setStartedAt(
                $this->getDateTimeHelper()->getNow()
                    ->setTimezone(new DateTimeZone(DateTimeHelperService::TIMEZONE_UTC))
            );
            $taskLog->setCommand($task->getCommand()->getCommand());
            $taskLog->setInput(
                $task->getCommand()->getInput() === null
                    ? null : $task->getCommand()->getInput()->getRawParameters()
            );
            $exitCode = $task->start();
            $taskLog->setFinishedAt(
                $this->getDateTimeHelper()->getNow()
                    ->setTimezone(new DateTimeZone(DateTimeHelperService::TIMEZONE_UTC))
            );
            $taskLog->setStatus($exitCode);
            $this->getEntityManager()->persist($taskLog);
            $this->getEntityManager()->flush();
            $method = $exitCode === self::SUCCESS ? 'success' : 'error';
            $this->getIO()->$method($task->getCommand()->getCommand() . "; Exit code: $exitCode");
        }

        $this->getIO()->success('Scheduler success');
        return self::SUCCESS;
    }
}
