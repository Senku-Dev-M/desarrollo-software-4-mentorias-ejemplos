using Games.Application.DTOs;
using Games.Application.Games.Create;
using Games.Application.Games.Delete;
using Games.Application.Games.GetAll;
using Games.Application.Games.GetById;
using Games.Application.Games.Update;
using Microsoft.AspNetCore.Mvc;

namespace Games.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class GamesController : ControllerBase
{
    private readonly CreateGameUseCase _createGameUseCase;
    private readonly GetGameByIdUseCase _getGameByIdUseCase;
    private readonly GetAllGamesUseCase _getAllGamesUseCase;
    private readonly UpdateGameUseCase _updateGameUseCase;
    private readonly DeleteGameUseCase _deleteGameUseCase;

    public GamesController(
        CreateGameUseCase createGameUseCase,
        GetGameByIdUseCase getGameByIdUseCase,
        GetAllGamesUseCase getAllGamesUseCase,
        UpdateGameUseCase updateGameUseCase,
        DeleteGameUseCase deleteGameUseCase)
    {
        _createGameUseCase = createGameUseCase;
        _getGameByIdUseCase = getGameByIdUseCase;
        _getAllGamesUseCase = getAllGamesUseCase;
        _updateGameUseCase = updateGameUseCase;
        _deleteGameUseCase = deleteGameUseCase;
    }

    /// <summary>
    /// Retrieves all games.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GameDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<GameDto>>> GetAll(CancellationToken cancellationToken)
    {
        var response = await _getAllGamesUseCase.ExecuteAsync(cancellationToken);
        return Ok(response.Games);
    }

    /// <summary>
    /// Retrieves a game by its unique identifier.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(GetGameByIdResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<GetGameByIdResponse>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _getGameByIdUseCase.ExecuteAsync(id, cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Creates a new game.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CreateGameResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CreateGameResponse>> Create([FromBody] CreateGameRequest request, CancellationToken cancellationToken)
    {
        var response = await _createGameUseCase.ExecuteAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    /// <summary>
    /// Updates an existing game.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateGameRequest request, CancellationToken cancellationToken)
    {
        await _updateGameUseCase.ExecuteAsync(id, request, cancellationToken);
        return NoContent();
    }

    /// <summary>
    /// Deletes a game by its identifier.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _deleteGameUseCase.ExecuteAsync(id, cancellationToken);
        return NoContent();
    }
}
