<?php

namespace Optimust\Core\Command;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Optimust\Config\Config;
use Optimust\Framework\Console\Command;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\DBAL\DriverManager;

class GenerateDoctrineProxiesCommand extends Command
{
    /**
     * @inheritDoc
     */
    public function getCommandName(): string
    {
        return 'orm:generate-proxies';
    }

    /**
     * @inheritDoc
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $conf = Config::getConf();
        $proxyDir = Config::get(Config::DOCTRINE_PROXY_DIR);
        $cache = new ArrayAdapter();
        $paths = $this->getPaths();
        $config = ORMSetup::createAttributeMetadataConfiguration(
            $paths,
            false,
            $proxyDir,
            $cache
        );

        $connectionParams = [
            'driver' => 'pdo_sqlite',
            'memory' => true,
            'charset' => 'utf8mb4',
        ];

        $connection = DriverManager::getConnection($connectionParams, $config);

        $em = new EntityManager($connection, $config);

        $metadata = $em->getMetadataFactory()
            ->getAllMetadata();

        $count = $em->getProxyFactory()
            ->generateProxyClasses($metadata, $proxyDir);

        $this->getIO()->success("$count proxy classes created");
        return self::SUCCESS;
    }

    /**
     * @return array
     */
    private function getPaths(): array
    {
        $paths = [];
        $pluginPaths = Config::get('module_paths');
        foreach ($pluginPaths as $pluginPath) {
            $entityPath = realpath($pluginPath . '/entity');
            if ($entityPath) {
                $paths[] = $entityPath;
            }
        }
        return $paths;
    }
}
