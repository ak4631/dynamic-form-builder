<?php

use Optimust\Admin\Service\UserService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Http\Request;
use Optimust\Framework\ModuleConfigurationInterface;
use Optimust\Framework\Services;

class AdminModuleConfiguration implements ModuleConfigurationInterface
{
    use ServiceContainerTrait;

    /**
     * @inheritDoc
     */
    public function initialize(Request $request): void
    {
        $this->getContainer()->register(
            Services::USER_SERVICE,
            UserService::class
        );
    }
}
