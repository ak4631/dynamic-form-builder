<?php

namespace Optimust\Framework;

use Optimust\Config\Config;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Routing\Loader\YamlFileLoader;
use Symfony\Component\Routing\RouteCollection;

class RouteManager
{
    /**
     * @var null|RouteCollection
     */
    private static ?RouteCollection $routes = null;

    /**
     * @return RouteCollection
     */
    public static function getRoutes(): RouteCollection
    {
        if (is_null(self::$routes)) {
            $locator = new FileLocator();
            $yamlFileLoader = new YamlFileLoader($locator);
            self::$routes = new RouteCollection();

            //TODO:: move to resolve along with caching
            $modules = Config::get('modules');
            foreach ($modules as $module) {
                $routePath = realpath(__DIR__ . '/../../modules/' . $module . '/config/routes.yaml');
                if ($routePath) {
                    $moduleRoutes = $yamlFileLoader->load($routePath);
                    self::$routes->addCollection($moduleRoutes);
                }
            }
            return self::$routes;
        }

        return self::$routes;
    }
}
