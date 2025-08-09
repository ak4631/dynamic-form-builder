<?php

namespace Optimust\Authentication\Controller;

use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Framework\Http\Request;

class RootController extends AbstractController implements PublicControllerInterface
{
    /**
     * @inheritDoc
     */
    public function handle(Request $request)
    {
        return $this->redirect('auth/login');
    }
}
