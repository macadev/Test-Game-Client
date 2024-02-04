cmake_minimum_required(VERSION 3.11.1 FATAL_ERROR)

project(Simple-Game-Client)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/game_build)

include_directories("${CMAKE_SOURCE_DIR}/inc"
                    "${CMAKE_SOURCE_DIR}/../Shared/inc"
                    "${CMAKE_SOURCE_DIR}/dependencies/cgltf"
                    "${CMAKE_SOURCE_DIR}/dependencies/glad"
                    "${CMAKE_SOURCE_DIR}/dependencies/GLFW"
                    "${CMAKE_SOURCE_DIR}/dependencies/glm"
                    "${CMAKE_SOURCE_DIR}/dependencies/imgui"
                    "${CMAKE_SOURCE_DIR}/dependencies/KHR"
                    "${CMAKE_SOURCE_DIR}/dependencies/stb_image"
                    "${CMAKE_SOURCE_DIR}/../Simple-Game-Server/dependencies/bullet3-3.25")

set(project_headers
    inc/Camera3.h
    inc/ClockComputer.h
    inc/FiniteStateMachine.h
    inc/Frame.h
    inc/GameClient.h
    inc/GameStateManager.h
    inc/Interpolation.h
    inc/PingCaller.h
    inc/PlayState.h
    inc/State.h
    inc/TickCounterClient.h
    inc/Track.h
    inc/WebSocketClient.h
    ../Shared/inc/ApplicationTimer.h
    ../Shared/inc/bit_buffer.hpp
    ../Shared/inc/MessageParser.h
    ../Shared/inc/MessageStructures.h
    ../Shared/inc/MovementLogic.h
    ../Shared/inc/Quat.h
    ../Shared/inc/Transform.h
    ../Shared/inc/Player.h
    ../Shared/inc/Utility.h
    ../Shared/inc/SGSConfig.h
    ../Shared/inc/PhysicsSimulationShared.h
    ../Shared/inc/KinematicGameObject.h
    ../Shared/inc/MotionPatterns.h
    ../Shared/inc/JumpRopeMotionSelector.h
)

set(project_sources
    src/Camera3.cpp
    src/ClockComputer.cpp
    src/FiniteStateMachine.cpp
    src/GameClient.cpp
    src/GameStateManager.cpp
    src/main.cpp
    src/PingCaller.cpp
    src/PlayState.cpp
    src/Track.cpp
    src/WebSocketClient.cpp
    dependencies/cgltf/cgltf/cgltf.c
    dependencies/imgui/imgui/imgui.cpp
    dependencies/imgui/imgui/imgui_demo.cpp
    dependencies/imgui/imgui/imgui_draw.cpp
    dependencies/imgui/imgui/imgui_impl_glfw.cpp
    dependencies/imgui/imgui/imgui_impl_opengl3.cpp
    dependencies/imgui/imgui/imgui_tables.cpp
    dependencies/imgui/imgui/imgui_widgets.cpp
    dependencies/stb_image/stb_image/stb_image.cpp
    ../Shared/src/MessageParser.cpp
    ../Shared/src/bit_buffer.cpp
    ../Shared/src/Quat.cpp
    ../Shared/src/Transform.cpp
    ../Shared/src/Player.cpp
    ../Shared/src/Utility.cpp
    ../Shared/src/PhysicsSimulationShared.cpp
    ../Shared/src/MotionPatterns.cpp
)

# This path must be relative to the location of the build folder
set(project_resources "../resources@resources")

set(CMAKE_EXECUTABLE_SUFFIX ".html")

# For debugging
#set(CMAKE_CXX_FLAGS "-O0 -s USE_WEBGL2=1 -s FULL_ES3=1 -s USE_GLFW=3 -s WASM=1 -s ASSERTIONS=1 -s ALLOW_MEMORY_GROWTH=1 -o index.html --preload-file ${project_resources} --use-preload-plugins -pthread")
# For releasing
# Setting PTHREAD_POOL_SIZE_STRICT=0 means threads will be created on demand. This stopped the error
# message that says "thread pool exhausted" from showing up in the console.
# TODO: Remember to remove ASSERTIONS before shipping the final build
# TODO: reenable this when packaging resources (textures, models, etc): --preload-file ${project_resources} --use-preload-plugins

# To enable threading add: -pthread -s PTHREAD_POOL_SIZE_STRICT=0 -s ALLOW_MEMORY_GROWTH=1
set(CMAKE_CXX_FLAGS "-O3 -lwebsocket.js -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s ASSERTIONS=1 -o index.html --preload-file ${project_resources} --use-preload-plugins")

# Uncomment this line and the imgui .cpp files above to enable IMGUI
#add_definitions(-DENABLE_IMGUI)

# Uncomment this line and the AudioEngine.cpp, AudioSource.cpp, AudioEngine.h and AudioSource.h files above to enable IMGUI
#add_definitions(-DENABLE_AUDIO)

# Uncomment this line and the FlyCam.h file above to enable the fly cam, which is great for recording videos for marketing purposes
#add_definitions(-DENABLE_FLY_CAM)

# Bullet static libraries were compiled with this flag. We need to pass it to our build as well.
# Otherwise heap corruption takes place, which is insanely hard to debug.
add_definitions(-DBT_USE_DOUBLE_PRECISION)

add_executable(${PROJECT_NAME} ${project_headers} ${project_sources})

target_link_libraries(${PROJECT_NAME}
  "${CMAKE_SOURCE_DIR}/../libBullet3Common.a"
  "${CMAKE_SOURCE_DIR}/../libBullet3Geometry.a"
  "${CMAKE_SOURCE_DIR}/../libBulletCollision.a"
  "${CMAKE_SOURCE_DIR}/../libBullet3Collision.a"
  "${CMAKE_SOURCE_DIR}/../libBulletDynamics.a"
  "${CMAKE_SOURCE_DIR}/../libBullet3Dynamics.a"
  "${CMAKE_SOURCE_DIR}/../libLinearMath.a"
)
