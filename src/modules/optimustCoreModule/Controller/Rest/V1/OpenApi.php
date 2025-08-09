<?php

namespace Optimust\Core\Controller\Rest\V1;

use OpenApi\Annotations as OA;

/**
 * @OA\OpenApi(
 *     openapi="3.1.0",
 *     @OA\Components(
 *         @OA\RequestBody(
 *             request="DeleteRequestBody",
 *             @OA\JsonContent(
 *                 @OA\Property(property="ids", type="array", @OA\Items(type="integer")),
 *                 required={"ids"}
 *             )
 *         ),
 *         @OA\Response(
 *             response="DeleteResponse",
 *             description="Success",
 *             @OA\JsonContent(
 *                 @OA\Property(property="data", type="array", @OA\Items(type="integer")),
 *                 @OA\Property(property="meta", type="object")
 *             )
 *         ),
 *         @OA\Response(
 *             response="RecordNotFound",
 *             description="Record Not Found",
 *             @OA\JsonContent(
 *                 @OA\Property(
 *                     property="error",
 *                     type="object",
 *                     @OA\Property(property="status", type="string", default="404"),
 *                     @OA\Property(property="message", type="string")
 *                 ),
 *                 example={"error" : {"status" : "404", "message" : "Record Not Found"}}
 *             )
 *         ),
 *         @OA\Parameter(
 *             name="sortOrder",
 *             in="query",
 *             required=false,
 *             @OA\Schema(type="string", enum={"ASC", "DESC"})
 *         ),
 *         @OA\Parameter(
 *             name="limit",
 *             in="query",
 *             required=false,
 *             @OA\Schema(type="integer", default=50)
 *         ),
 *         @OA\Parameter(
 *             name="offset",
 *             in="query",
 *             required=false,
 *             @OA\Schema(type="integer", default=0)
 *         )
 *     )
 * )
 * @OA\Info(
 *     title="Optimust Open Source : REST API v2 docs",
 *     version=\Optimust\Config\Config::Optimust_API_VERSION,
 * )
 * @OA\Server(
 *     url="{Optimust-url}",
 *     variables={
 *         @OA\ServerVariable(
 *             serverVariable="Optimust-url",
 *             default="https://opensource-demo.Optimustlive.com/index.php"
 *         )
 *     }
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="Cookie-HTTPS",
 *     type="apiKey",
 *     in="cookie",
 *     name="Optimust"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="Cookie-HTTP",
 *     type="apiKey",
 *     in="cookie",
 *     name="_Optimust"
 * )
 */
final class OpenApi
{
}
