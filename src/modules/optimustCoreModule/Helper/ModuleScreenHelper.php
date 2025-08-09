<?php

namespace Optimust\Core\Helper;

use Optimust\Core\Dto\ModuleScreen;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\RequestStack;
use Optimust\Framework\ServiceContainer;
use Optimust\Framework\Services;

class ModuleScreenHelper
{
    /**
     * @var ModuleScreen|null
     */
    private static ?ModuleScreen $moduleScreen = null;

    /**
     * @return ModuleScreen
     */
    public static function getCurrentModuleAndScreen(): ModuleScreen
    {
        if (!self::$moduleScreen instanceof ModuleScreen) {
            $moduleScreen = new ModuleScreen();
            $request = self::getCurrentRequest();
            if ($request) {
                $pathChunks = explode('/', $request->getPathInfo());
                if (isset($pathChunks[1])) {
                    $moduleScreen->setModule($pathChunks[1]);
                }
                if (isset($pathChunks[2])) {
                    $moduleScreen->setScreen($pathChunks[2]);
                }
            }
            self::$moduleScreen = $moduleScreen;
        }

        return self::$moduleScreen;
    }

    /**
     * @return Request|null
     */
    public static function getCurrentRequest(): ?Request
    {
        /** @var RequestStack $requestStack */
        $requestStack = ServiceContainer::getContainer()->get(Services::REQUEST_STACK);
        return $requestStack->getCurrentRequest();
    }

    /**
     * Reset current module and screen
     */
    public static function resetCurrentModuleAndScreen(): void
    {
        self::$moduleScreen = null;
    }
}
