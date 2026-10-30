using FluentAssertions;
using Games.Application.Abstractions.Persistence;
using Games.Application.Games.Create;
using Games.Domain.Entities;
using Games.Domain.Exceptions;
using Moq;
using Xunit;

namespace Games.Application.Tests;

public class CreateGameUseCaseTests
{
    private readonly Mock<IGameRepository> _repositoryMock;
    private readonly CreateGameUseCase _useCase;

    public CreateGameUseCaseTests()
    {
        _repositoryMock = new Mock<IGameRepository>();
        _useCase = new CreateGameUseCase(_repositoryMock.Object);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidRequest_ShouldCreateAndReturnGame()
    {
        // Arrange
        var request = new CreateGameRequest(
            Name: "The Legend of Zelda: Breath of the Wild",
            Genre: "Action-Adventure",
            Developer: "Nintendo EPD",
            ReleaseYear: 2017,
            Price: 59.99m
        );

        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Game>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Game g, CancellationToken _) => g);

        // Act
        var response = await _useCase.ExecuteAsync(request);

        // Assert
        response.Should().NotBeNull();
        response.Id.Should().NotBeEmpty();
        response.Name.Should().Be("The Legend of Zelda: Breath of the Wild");
        response.Genre.Should().Be("Action-Adventure");
        response.Developer.Should().Be("Nintendo EPD");
        response.ReleaseYear.Should().Be(2017);
        response.Price.Should().Be(59.99m);

        _repositoryMock.Verify(r => r.AddAsync(It.Is<Game>(g => g.Name == request.Name), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("", "Genre", "Dev", 2020, 10)]
    [InlineData("   ", "Genre", "Dev", 2020, 10)]
    [InlineData("Valid", "", "Dev", 2020, 10)]
    [InlineData("Valid", "Genre", "", 2020, 10)]
    [InlineData("Valid", "Genre", "Dev", 1920, 10)]
    [InlineData("Valid", "Genre", "Dev", 2020, -5)]
    public async Task ExecuteAsync_WithInvalidData_ShouldThrowDomainException(
        string name, string genre, string developer, int releaseYear, decimal price)
    {
        // Arrange
        var request = new CreateGameRequest(name, genre, developer, releaseYear, price);

        // Act
        var act = async () => await _useCase.ExecuteAsync(request);

        // Assert
        await act.Should().ThrowAsync<DomainException>();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Game>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
