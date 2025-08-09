<?php

namespace Optimust\Core\Controller;

use Optimust\Config\Config;
use Optimust\Core\Controller\Exception\ReactControllerException;
use Optimust\Core\Dto\AttributeBag;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Exception\ServiceException;
use Optimust\Core\Helper\ReactControllerHelper;
use Optimust\Core\React\Component;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Http\Response;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Loader\FilesystemLoader;

abstract class AbstractReactController extends AbstractViewController
{
    /**
     * @var Environment|null
     */
    private ?Environment $twig = null;
    /**
     * @var string
     */
    private string $template = 'react.html.twig';
    /**
     * @var null|Component
     */
    private ?Component $component = null;
    /**
     * @var AttributeBag
     */
    private AttributeBag $context;
    /**
     * @var ReactControllerHelper
     */
    private ReactControllerHelper $reactControllerHelper;

    /**
     * @var bool
     */
    private bool $handled = false;

    public function __construct()
    {
        $loader = new FilesystemLoader(Config::get(Config::APP_TEMPLATE_DIR));
        $this->twig = new Environment($loader, ['cache' => false]);
        $this->context = new AttributeBag();
        $this->reactControllerHelper = new ReactControllerHelper();
        $this->init();
    }

    /**
     * @param Environment $twig
     */
    public function setTwig(Environment $twig): void
    {
        $this->twig = $twig;
    }

    /**
     * @return Environment
     */
    public function getTwig(): Environment
    {
        return $this->twig;
    }

    /**
     * @param string $template
     */
    public function setTemplate(string $template): void
    {
        $this->template = $template;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return $this->template;
    }

    /**
     * @param Component $component
     */
    public function setComponent(Component $component): void
    {
        if ($this->isHandled()) {
            throw ReactControllerException::alreadyHandled();
        }
        $this->component = $component;
    }

    /**
     * @return Component
     */
    public function getComponent(): Component
    {
        return $this->component;
    }

    /**
     * @throws ReactControllerException
     */
    public function init(): void
    {
    }

    /**
     * @param Request $request
     * @throws ReactControllerException
     */
    public function preRender(Request $request): void
    {
    }

    /**
     * @param Request $request
     * @return string
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     * @throws DaoException
     * @throws ServiceException
     */
    public function render(Request $request): string
    {
        $this->reactControllerHelper->setRequest($request);
        $this->reactControllerHelper->setComponent($this->getComponent());
        $this->getContext()->add($this->reactControllerHelper->getContextParams());
        return $this->getTwig()->render(
            $this->getTemplate(),
            $this->getContext()->all(),
        );
    }

    /**
     * @param Request $request
     * @throws ReactControllerException
     */
    public function postRender(Request $request): void
    {
    }

    /**
     * @param Request $request
     * @return Response|RedirectResponse
     * @throws DaoException
     * @throws LoaderError
     * @throws RuntimeError
     * @throws ServiceException
     * @throws SyntaxError
     */
    public function handle(Request $request)
    {
        if (!$this->isHandled()) {
            $this->preRender($request);
        }
        if (!$this->isHandled()) {
            $content = $this->render($request);
        }
        if (!$this->isHandled()) {
            $this->postRender($request);
        }

        $response = $this->getResponse();
        if (isset($content)) {
            $response->setContent($content);
        }

        return $response;
    }

    /**
     * @return AttributeBag
     */
    public function getContext(): AttributeBag
    {
        return $this->context;
    }

    /**
     * @inheritDoc
     */
    protected function handleBadRequest(?Response $response = null): Response
    {
        // TODO:: develop UI for bad request controllers
        $component = new Component('bad-request');
        $this->setComponent($component);
        $this->setHandled(true);
        return parent::handleBadRequest($response);
    }

    /**
     * @param RedirectResponse|Response|null $response
     */
    protected function setResponse($response): void
    {
        parent::setResponse($response);
        $this->setHandled(!is_null($response));
    }

    /**
     * @return bool
     */
    protected function isHandled(): bool
    {
        return $this->handled;
    }

    /**
     * @param bool $handled
     */
    protected function setHandled(bool $handled): void
    {
        $this->handled = $handled;
    }
}
