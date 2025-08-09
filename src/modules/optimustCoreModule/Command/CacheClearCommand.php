<?php

namespace Optimust\Core\Command;

use Optimust\Core\Service\CacheService;
use Optimust\Framework\Console\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CacheClearCommand extends Command
{
    /**
     * @inheritDoc
     */
    public function getCommandName(): string
    {
        return 'cache:clear';
    }

    /**
     * @inheritDoc
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $namespaces = ['optimust', 'doctrine_metadata', 'doctrine_queries'];
        $failed = false;
        foreach ($namespaces as $namespace) {
            $success = CacheService::getCache($namespace)->clear();
            if ($success) {
                $this->getIO()->success("Successfully cleared cache: `$namespace`");
                continue;
            }
            $failed = true;
            $this->getIO()->error("Failed to clear cache: `$namespace`");
        }

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
