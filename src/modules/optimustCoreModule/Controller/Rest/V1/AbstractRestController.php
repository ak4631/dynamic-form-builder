<?php

namespace Optimust\Core\Controller\Rest\V1;

use Error;
use Exception;
use Optimust\Core\Api\V1\Exception\BadRequestException;
use Optimust\Core\Api\V1\Exception\ForbiddenException;
use Optimust\Core\Api\V1\Exception\InvalidParamException;
use Optimust\Core\Api\V1\Exception\NotImplementedException;
use Optimust\Core\Api\V1\Exception\RecordNotFoundException;
use Optimust\Core\Api\V1\Request;
use Optimust\Core\Api\V1\Response;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Validator;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Framework\Http\Request as HttpRequest;
use Optimust\Framework\Http\Response as HttpResponse;

abstract class AbstractRestController extends AbstractController
{
    use LoggerTrait;

    protected ?ParamRuleCollection $getValidationRule = null;
    protected ?ParamRuleCollection $postValidationRule = null;
    protected ?ParamRuleCollection $putValidationRule = null;
    protected ?ParamRuleCollection $deleteValidationRule = null;

    /**
     * @param Request $request
     */
    protected function init(Request $request)
    {
    }

    /**
     * @param Request $request
     * @return Response
     */
    abstract protected function handleGetRequest(Request $request): Response;

    /**
     * @param Request $request
     * @return Response
     */
    abstract protected function handlePostRequest(Request $request): Response;

    /**
     * @param Request $request
     * @return Response
     */
    abstract protected function handlePutRequest(Request $request): Response;

    /**
     * @param Request $request
     * @return Response
     */
    abstract protected function handleDeleteRequest(Request $request): Response;

    /**
     * @param Request $request
     * @return ParamRuleCollection|null
     */
    abstract protected function initGetValidationRule(Request $request): ?ParamRuleCollection;

    /**
     * @param Request $request
     * @return ParamRuleCollection|null
     */
    abstract protected function initPostValidationRule(Request $request): ?ParamRuleCollection;

    /**
     * @param Request $request
     * @return ParamRuleCollection|null
     */
    abstract protected function initPutValidationRule(Request $request): ?ParamRuleCollection;

    /**
     * @param Request $request
     * @return ParamRuleCollection|null
     */
    abstract protected function initDeleteValidationRule(Request $request): ?ParamRuleCollection;

    /**
     * @param Request $request
     * @return ParamRuleCollection|null
     */
    protected function getValidationRule(Request $request): ?ParamRuleCollection
    {
        switch ($request->getHttpRequest()->getMethod()) {
            case Request::METHOD_GET:
                return $this->initGetValidationRule($request);

            case Request::METHOD_POST:
                return $this->initPostValidationRule($request);

            case Request::METHOD_PUT:
                return $this->initPutValidationRule($request);

            case Request::METHOD_DELETE:
                return $this->initDeleteValidationRule($request);

            default:
                return null;
        }
    }

    /**
     * @param HttpRequest $httpRequest
     * @return HttpResponse
     * @throws Exception
     */
    public function handle(HttpRequest $httpRequest): HttpResponse
    {
        $request = new Request($httpRequest);
        $this->init($request);
        $response = new HttpResponse();
        $response->headers->set(Response::CONTENT_TYPE_KEY, Response::CONTENT_TYPE_JSON);
        try {
            $validationRule = $this->getValidationRule($request);
            if ($validationRule instanceof ParamRuleCollection) {
                Validator::validate($request->getAllParameters(), $validationRule);
            }
            switch ($httpRequest->getMethod()) {
                case Request::METHOD_GET:
                    $response->setContent($this->handleGetRequest($request)->formatData());
                    break;

                case Request::METHOD_POST:
                    $response->setContent($this->handlePostRequest($request)->formatData());
                    break;

                case Request::METHOD_PUT:
                    $response->setContent($this->handlePutRequest($request)->formatData());
                    break;

                case Request::METHOD_DELETE:
                    $response->setContent($this->handleDeleteRequest($request)->formatData());
                    break;

                default:
                    throw new NotImplementedException();
            }
        } catch (RecordNotFoundException $e) {
            $this->getLogger()->info($e->getMessage());
            $this->getLogger()->info($e->getTraceAsString());

            $response->setContent(
                Response::formatError(
                    ['error' => ['status' => '404', 'message' => $e->getMessage()]]
                )
            );
            $response->setStatusCode(404);
        } catch (InvalidParamException $e) {
            $this->getLogger()->info($e->getMessage());
            $this->getLogger()->info($e->getTraceAsString());

            // TODO:: should format to show multiple errors
            $response->setContent(
                Response::formatError(
                    [
                        'error' => [
                            'status' => '422',
                            'message' => $e->getMessage(),
                            'data' => $e->getNormalizedErrorBag()
                        ]
                    ]
                )
            );
            $response->setStatusCode(422);
        } catch (NotImplementedException $e) {
            $this->getLogger()->info($e->getMessage());
            $this->getLogger()->info($e->getTraceAsString());

            $response->setContent(
                Response::formatError(
                    ['error' => ['status' => '501', 'message' => 'Not Implemented']]
                )
            );
            $response->setStatusCode(501);
        } catch (BadRequestException $e) {
            $this->getLogger()->info($e->getMessage());
            $this->getLogger()->info($e->getTraceAsString());

            $response->setContent(
                Response::formatError(
                    [
                        'error' => [
                            'status' => '400',
                            'message' => $e->getMessage()
                        ]
                    ]
                )
            );
            $response->setStatusCode(400);
        } catch (ForbiddenException $e) {
            // Escape this exception to handle it in
            // \Optimust\Core\Subscriber\ApiAuthorizationSubscriber::onExceptionEvent
            throw $e;
        } catch (Exception $e) {
            $this->getLogger()->error($e->getMessage());
            $this->getLogger()->error($e->getTraceAsString());

            $response->setContent(
                Response::formatError(
                    ['error' => ['status' => '500', 'message' => 'Unexpected Error Occurred']]
                )
            );
            $response->setStatusCode(500);
        } catch (Error $e) {
            $this->getLogger()->critical($e->getMessage());
            $this->getLogger()->critical($e->getTraceAsString());

            $response->setContent(
                Response::formatError(
                    ['error' => ['status' => '500', 'message' => 'Unexpected Error Occurred']]
                )
            );
            $response->setStatusCode(500);
        }

        return $response;
    }
}
