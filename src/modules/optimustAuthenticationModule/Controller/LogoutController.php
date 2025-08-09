<?php

namespace Optimust\Authentication\Controller;

use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Session\Session;
use Optimust\Framework\Services;

class LogoutController extends AbstractController
{
    use ServiceContainerTrait;

    public function handle(): RedirectResponse
    {
        /** @var Session $session */
        $session = $this->getContainer()->get(Services::SESSION);
        $session->invalidate();
        return $this->redirect("auth/login");
    }
}
