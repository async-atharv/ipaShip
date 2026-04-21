from setuptools import setup

setup(
    name='ipaship',
    version='1.3.0',
    packages=['ipaship'],
    entry_points={'console_scripts': ['ipaship=ipaship.__main__:main']},
    install_requires=[],
    author='async-atharv',
    description='AI-powered App Store review audit.',
    url='https://github.com/async-atharv/ipaShip',
)