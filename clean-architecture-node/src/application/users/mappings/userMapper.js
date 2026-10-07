export function toUserDto(user) {
  return {
    id: user.id,
    name: user.name.value,
    email: user.email.value,
    createdAtUtc: user.createdAtUtc.toISOString(),
  };
}
