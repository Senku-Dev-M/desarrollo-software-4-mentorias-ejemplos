using FluentAssertions;
using Games.Application.Abstractions.Persistence;
using Games.Application.Games.Delete;
using Games.Domain.Entities;
using Games.Domain.Exceptions;
using Moq;
using Xunit;

namespace Games.Application.Tests;

public class DeleteGameUseCaseTests
{
    private readonly Mock<IGameRepository> _repositoryMock;
    private readonly DeleteGameUseCase _useCase;

    public DeleteGameUseCaseTests()
    {
        _repositoryMock = new Mock<IGameRepository>();
        _useCase = new DeleteGameUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameExists_ShouldDeleteFromRepository()
    {
        // Arrange
        var game = new Game("Portal 2", "Puzzle-Platform", "Valve", 2011, 9.99m);
        _repositoryMock.Setup(r => r.GetByIdAsync(game.Id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(game);

        // Act
        await _useCase.ExecuteAsync(game.Id);

        // Assert
        _repositoryMock.Verify(r => r.DeleteAsync(game, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WhenGameDoesNotExist_ShouldThrowEntityNotFoundException()
    {
        // Arrange
        var missingId = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(missingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Game?)null);

        // Act
        var act = async () => await _useCase.ExecuteAsync(missingId);

        // Assert
        await act.Should().ThrowAsync<EntityNotFoundException>();
        _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Game>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
